import { CheckboxField } from '@/components/fields/checkbox-field';
import { Button } from '@/components/ui/button';
import { PaymentMethodFields } from '../../payment-method-fields/payment-method-fields';
import { UseFormReturn } from 'react-hook-form';

interface PaymentMethodSectionProps {
  form: UseFormReturn<any>;
  index: number;
  type: 'debitCard' | 'qr';
  onOpenPosCommerceModal?: () => void;
}

export const PaymentMethodSection = ({
  form,
  index,
  type,
  onOpenPosCommerceModal,
}: PaymentMethodSectionProps) => {
  const isDebitCard = type === 'debitCard';
  const fieldPrefix = isDebitCard ? 'debitCard' : 'qr';
  const title = isDebitCard ? 'Tarjetas de Débito' : 'Código QR';
  const checkboxLabel = isDebitCard
    ? 'Configurar método de pago con Tarjeta.'
    : 'Configurar método de pago con QR.';

  const isEnabled = form.watch(
    `campaigns.${index}.is${isDebitCard ? 'DebitCard' : 'QR'}Payment`
  );

  return (
    <div className='w-full flex flex-col'>
      <div
        className={`h-12 p-3 ${
          isDebitCard ? 'bg-gray-badge' : 'bg-[#EFECF3]'
        } flex justify-center`}
      >
        <p
          className={`text-center text-sm font-medium leading-snug ${
            !isDebitCard ? 'text-primary' : ''
          }`}
        >
          {title}
        </p>
      </div>
      <div
        className={`py-3 px-6 ${
          isDebitCard ? 'bg-gray-100' : 'bg-white'
        } flex flex-col gap-y-5 flex-grow`}
      >
        <CheckboxField
          form={form}
          id={`campaigns.${index}.is${isDebitCard ? 'DebitCard' : 'QR'}Payment`}
          label={checkboxLabel}
          className='bg-transparent'
        />
        {isEnabled && (
          <PaymentMethodFields
            form={form}
            fields={[
              {
                id: `campaigns.${index}.${fieldPrefix}GlobalPercentage`,
                label: 'Porcentaje de débito al negocio (%)',
                placeholder: 'Ingresa el porcentaje',
              },
              {
                id: `campaigns.${index}.${fieldPrefix}ClientPercentage`,
                label: 'Porcentaje de Cashback otorgado al cliente (%)',
                placeholder: 'Ingresa el porcentaje',
              },
              {
                id: `campaigns.${index}.${fieldPrefix}CompanyPercentage`,
              },
              {
                id: `campaigns.${index}.${fieldPrefix}BnbPercentage`,
              },
            ]}
          >
            {isDebitCard && onOpenPosCommerceModal && (
              <Button
                variant='secondary'
                type='button'
                className='w-fit mx-auto'
                onClick={onOpenPosCommerceModal}
              >
                Códigos de Comercio
              </Button>
            )}
          </PaymentMethodFields>
        )}
      </div>
    </div>
  );
};
