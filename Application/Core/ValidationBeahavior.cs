using FluentValidation;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Core
{
    public class ValidationBeahavior<TRequest, TResponse>(IValidator<TRequest>? validator = null) : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
    {
        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            if (validator == null) return await next();

            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid) throw new ValidationException(validationResult.Errors);

            return await next();
        }
    }
}
