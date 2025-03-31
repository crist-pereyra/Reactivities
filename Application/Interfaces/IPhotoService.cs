using Application.Profiles.DTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IPhotoService
    {
        Task<PhotoUploadResult?> UploadPhoto(IFormFile file);
        Task<string> DeletePhoto(string publicId);
    }
}
