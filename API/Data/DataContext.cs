using System;
using System.Runtime.CompilerServices;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext : DbContext
{
    //constructor
    public DataContext(DbContextOptions options) : base(options) { }
    //properties
    public DbSet<AppUser> Users { get; set; }
}
