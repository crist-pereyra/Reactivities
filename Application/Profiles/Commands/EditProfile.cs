using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles.Commands
{
    public class EditProfile
    {
        public class Command : IRequest<Result<Unit>> 
        {
            public required string DisplayName { get; set; }
            public required string Bio { get; set; }
        }

        public class Handler(AppDbContext context, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await userAccessor.GetUserAsync();
                user.DisplayName = request.DisplayName;
                user.Bio = request.Bio;
                context.Entry(user).State = EntityState.Modified;
                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result
                        ? Result<Unit>.Success(Unit.Value)
                        : Result<Unit>.Failure("Failed to update profile", 400);
            }
        }
    }
}
