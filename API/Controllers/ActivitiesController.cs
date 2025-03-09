using Application.Activities.Commands;
using Application.Activities.DTOs;
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
        public async Task<ActionResult<Activity>> GetActivityDetail(string id) => HandleResult(await Mediator.Send(new GetActivityDetails.Query { Id = id }));   

        [HttpPost]
        public async Task<ActionResult<string>> CreateActivity(CreateActivityDto activityDto) =>
            HandleResult(await Mediator.Send(new CreateActivity.Command { ActivityDto = activityDto }));

        [HttpPut]
        public async Task<ActionResult> EditActivity(EditActiviyDto activity) => 
            HandleResult(await Mediator.Send(new EditActivity.Command { ActivityDto = activity }));

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteActivity(string id) => 
            HandleResult(await Mediator.Send(new DeleteActivity.Command { Id = id }));
    }
}
