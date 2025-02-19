using System;
using System.Security.Cryptography.X509Certificates;

namespace API.Helpers;

public class MessageParams : PaginationParams
{
    public string? Username { get; set; }
    public string Container { get; set; } = "Unread";
}
