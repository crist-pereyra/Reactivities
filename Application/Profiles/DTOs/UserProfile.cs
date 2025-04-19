using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles.DTOs
{
    public class UserProfile
    {
        public required string Id { get; set; }
        public required string DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? ImageUrl { get; set; }
        public bool Following { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
    }
}
