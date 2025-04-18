using Microsoft.EntityFrameworkCore;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistence
{
    public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
    {
        public required DbSet<Activity> Activities { get; set; }
        public required DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public required DbSet<Photo> Photos { get; set; }
        public required DbSet<Comment> Comments { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(x => x.HasKey(a => new { a.ActivityId, a.UserId }));

            builder.Entity<ActivityAttendee>().HasOne(u => u.User).WithMany(a => a.Activities).HasForeignKey(aa => aa.UserId);
            builder.Entity<ActivityAttendee>().HasOne(u => u.Activity).WithMany(a => a.Attendees).HasForeignKey(aa => aa.ActivityId);

            var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime))
                    {
                        property.SetValueConverter(dateTimeConverter);
                    }
                }
            }
        }
    }
}
