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
    public class EditActivityValidator : BaseActivityValidator<EditActivity.Command, EditActiviyDto>
    {
        public EditActivityValidator() : base(x => x.ActivityDto)
        {
            RuleFor(x => x.ActivityDto.Id).NotEmpty().WithMessage("Id is required");
        }
    }
}
