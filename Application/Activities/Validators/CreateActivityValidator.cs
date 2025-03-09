using Application.Activities.Commands;
using Application.Activities.DTOs;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities.Validators
{
    public class CreateActivityValidator : BaseActivityValidator<CreateActivity.Command, CreateActivityDto>
    {
        public CreateActivityValidator() : base(x => x.ActivityDto)
        {
            
        }
    }
}
