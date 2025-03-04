using Application.Activities.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities() => 
            await Mediator.Send(new GetActivityList.Query());

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivityDetail(string id) =>
            await Mediator.Send(new GetActivityDetails.Query { Id = id });
    }
}
