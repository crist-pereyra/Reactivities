using Application.Profiles.Commands;
using Application.Profiles.DTOs;
using Application.Profiles.Queries;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto(IFormFile file) => HandleResult(await Mediator.Send(new AddPhoto.Command { File = file }));

        [HttpGet("{userId}/photos")]
        public async Task<ActionResult<List<Photo>>> GetPhotos(string userId) => HandleResult(await Mediator.Send(new GetProfilePhotos.Query { UserId = userId }));

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserProfile>> GetProfile(string userId) => HandleResult(await Mediator.Send(new GetProfile.Query { UserId = userId }));

        [HttpPut("{photoId}/set-main-photo")]
        public async Task<ActionResult> SetMainPhoto(string photoId) => HandleResult(await Mediator.Send(new SetMainPhoto.Command { PhotoId = photoId }));

        [HttpDelete("{photoId}/photos")]
        public async Task<ActionResult> DeletePhoto(string photoId) => HandleResult(await Mediator.Send(new DeletePhoto.Command { PhotoId = photoId }));
    
    }
}
