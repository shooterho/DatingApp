using System;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTO;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly UserManager<AppUser> userManager;
    private readonly ITokenService tokenService;
    private readonly IMapper mapper;
    public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper)
    {
        this.userManager = userManager;
        this.tokenService = tokenService;
        this.mapper = mapper;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");


        var user = mapper.Map<AppUser>(registerDto);
        user.UserName = registerDto.Username.ToLower();

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded) return BadRequest(result.Errors);

        UserDto userDto = new UserDto
        {
            Username = user.UserName,
            KnownAs = user.KnownAs,
            Gender = user.Gender,
            Token = await tokenService.CreateToken(user)
        };
        return userDto;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.NormalizedUserName == loginDto.Username.ToUpper());

        if (user == null || user.UserName == null) return Unauthorized("Invalid Username");

        var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

        if (!result) return Unauthorized();

        UserDto userDto = new UserDto
        {
            Username = user.UserName,
            KnownAs = user.KnownAs,
            Gender = user.Gender,
            Token = await tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
        };
        return userDto;
    }

    private async Task<bool> UserExists(string username)
    {
        return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
    }
}
