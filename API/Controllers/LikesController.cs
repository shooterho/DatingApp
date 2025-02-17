using System;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace API.Controllers;

public class LikesController : BaseApiController
{
    ILikesRepository likesRepository;
    public LikesController(ILikesRepository likesRepository)
    {
        this.likesRepository = likesRepository;
    }

    [HttpPost("{targetUserId:int}")]
    public async Task<ActionResult> ToggleLike(int targetUserId)
    {
        var sourceUserId = User.GetUserId();

        if (targetUserId == sourceUserId) return BadRequest("You cannot like yourself");


        var existingLike = await likesRepository.GetUserLike(sourceUserId, targetUserId);
        if (existingLike == null)
        {
            var like = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUserId
            };
            likesRepository.AddLike(like);
        }
        else
        {
            likesRepository.DeleteLike(existingLike);
        }
        if (await likesRepository.SaveChanges()) return Ok();

        return BadRequest("Failed to update like");

    }
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikeIds()
    {
        return Ok(await likesRepository.GetCurrentUserLikeIds(User.GetUserId()));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUserLikes([FromQuery] LikesParams likesParams)
    {
        likesParams.UserId = User.GetUserId();
        var members = await likesRepository.GetUserLikes(likesParams); //return a PagedList<MemberDto>

        Response.AddPaginationHeader(members);
        return Ok(members);
    }

}
