using System;
using API.Interfaces;

namespace API.Data;

public class UnitOfWork : IUnitOfWork
{
    public DataContext context;
    public IUserRepository UserRepository { get; }
    public IMessageRepository MessageRepository { get; }
    public ILikesRepository LikesRepository { get; }


    public UnitOfWork(DataContext context, IUserRepository userRepository, IMessageRepository messageRepository, ILikesRepository likesRepository)
    {
        this.context = context;
        UserRepository = userRepository;
        MessageRepository = messageRepository;
        LikesRepository = likesRepository;
    }
    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}
