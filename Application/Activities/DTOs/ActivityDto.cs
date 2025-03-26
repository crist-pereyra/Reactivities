using Application.Profiles.DTOs;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities.DTOs
{
    public class ActivityDto
    {
        public required string Id { get; set; }
        public required string Title { get; set; }
        public DateTime Date { get; set; }
        public required string Description { get; set; }
        public required string Category { get; set; }
        public bool IsCancelled { get; set; }
        public required string HostDisplayName { get; set; }
        public required string HostId { get; set; }

        // location props
        public required string City { get; set; }
        public required string Venue { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // navigations porps
        public ICollection<UserProfile> Attendees { get; set; } = [];
    }
}
