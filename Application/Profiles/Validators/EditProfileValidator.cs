using Application.Profiles.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles.Validators
{
    class EditProfileValidator : AbstractValidator<EditProfile.Command>
    {
        public EditProfileValidator()
        {
            RuleFor(x => x.DisplayName)
                .NotEmpty()
                .WithMessage("Display name is required");
        }
    }
}
