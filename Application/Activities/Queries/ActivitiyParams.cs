using Application.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities.Queries
{
    public class ActivitiyParams : PaginationParams<DateTime?>
    {
        public string? Filter { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }
}
