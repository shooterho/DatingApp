using System;

namespace API.DTO;

public class UserDto
{
    public required string Username { get; set; }
    public required string KnownAs { get; set; } //to display as name
    public required string Gender { get; set; }
    public required string Token { get; set; }
    public string? PhotoUrl { get; set; } //to display as main photo
}
