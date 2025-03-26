using Application.Activities.Commands;
using Application.Activities.DTOs;
using Application.Activities.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        //[AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<List<ActivityDto>>> GetActivities() =>
            await Mediator.Send(new GetActivityList.Query());

        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> GetActivityDetail(string id) => HandleResult(await Mediator.Send(new GetActivityDetails.Query { Id = id }));

        [HttpPost]
        public async Task<ActionResult<string>> CreateActivity(CreateActivityDto activityDto) =>
            HandleResult(await Mediator.Send(new CreateActivity.Command { ActivityDto = activityDto }));

        [HttpPut("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult> EditActivity(string id, EditActiviyDto activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new EditActivity.Command { ActivityDto = activity }));
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult> DeleteActivity(string id) => 
            HandleResult(await Mediator.Send(new DeleteActivity.Command { Id = id }));

        [HttpPost("{id}/attend")]
        public async Task<ActionResult> Attend(string id) => 
            HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
    }
}
