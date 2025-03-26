import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InputField } from '@/components/fields/input-field';
import { SelectField } from '@/components/fields/select-field';
import { Button } from '@/components/ui/button';
import { SwitchField } from '@/components/fields/switch-field';
import { DaysCheckField } from '../../days-check-field/days-check-field';
import { CheckboxField } from '@/components/fields/checkbox-field';
import { ToggleInputField } from '@/components/fields/toggle-input.field';
import { NumberInputField } from '@/components/fields/number-input-field';
import { Spinner } from '@/components/ui/spinner';
import { UseFormReturn } from 'react-hook-form';

interface CampaignFormSectionProps {
  form: UseFormReturn<any>;
  index: number;
  isVisible: boolean;
  options: any[];
  isCompanyDataLoading: boolean;
  isEdit: boolean;
  apiMarketClients: any[];
  onSearchCompanyData: () => void;
  onOpenApiMarketModal: () => void;
  onOpenPosCommerceModal: () => void;
}

export const CampaignFormSection = ({
  form,
  index,
  isVisible,
  options,
  isCompanyDataLoading,
  isEdit,
  apiMarketClients,
  onSearchCompanyData,
  onOpenApiMarketModal,
  onOpenPosCommerceModal,
}: CampaignFormSectionProps) => {
  return (
    <Card
      className={`p-8 bg-gray-100 w-full gap-0 ${isVisible ? '' : 'hidden'}`}
    >
      <h3 className='text-gray-80 text-xl font-semibold leading-7'>
        Datos Cashback
      </h3>

      {/* Campaign Name Section */}
      <span className='text-gray-500 text-base font-semibold leading-normal mt-5'>
        Nombre de la oferta
      </span>
      <p className='text-gray-600 text-sm font-normal leading-snug mt-2 mb-1'>
        Ingresa el nombre con el que identificarás la oferta Cashback
      </p>
      <div className='w-[324px] relative mb-4'>
        <InputField
          id={`campaigns.${index}.name`}
          form={form}
          label='Nombre'
          isRequired
          placeholder='Ingresa el nombre'
        />
        <span
          className={`text-neutral-400 text-xs font-normal w-full absolute text-right ${
            form.formState.errors.campaigns?.[index]?.name
              ? 'mt-[-20px]'
              : 'mt-2'
          }`}
        >
          {form.watch(`campaigns.${index}.name`).length}/50
        </span>
      </div>

      <Separator className='my-4' />

      {/* Contact Section */}
      <span className='text-gray-500 text-base font-semibold leading-normal'>
        Contacto
      </span>
      <p className='text-gray-600 text-sm font-normal leading-snug mt-2 mb-1'>
        Ingresa el correo electrónico de negocio:
      </p>
      <InputField
        id={`campaigns.${index}.email`}
        form={form}
        label='Correo electrónico'
        isRequired
        className='w-[324px]'
        placeholder='Ingresa el correo electrónico'
      />

      <Separator className='my-4' />

      {/* NIT and Account Section */}
      <span className='text-gray-500 text-base font-semibold leading-normal'>
        NIT y Cuenta destino
      </span>
      <p className='text-gray-600 text-sm font-normal leading-snug mt-2 mb-1'>
        Ingresa el NIT asociado a tu negocio.
      </p>
      <div
        className={`flex gap-5 ${
          form.formState.errors.campaigns?.[index]?.nit
            ? 'items-start'
            : 'items-end'
        }`}
      >
        <InputField
          id={`campaigns.${index}.nit`}
          label='Número de Identificación Tributaria (NIT)'
          isRequired
          type='number'
          form={form}
          className='w-[324px]'
          placeholder='Ingresa el NIT'
          onEnterPress={onSearchCompanyData}
          onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
            (e.target as HTMLInputElement).blur()
          }
        />
        <Button
          type='button'
          onClick={onSearchCompanyData}
          className={
            form.formState.errors.campaigns?.[index]?.nit ? 'mt-6' : ''
          }
          disabled={form.watch(`campaigns.${index}.nit`).length === 0}
        >
          {isCompanyDataLoading ? <Spinner size='small' /> : 'Buscar'}
        </Button>
      </div>
      <SelectField
        id={`campaigns.${index}.accountNumber`}
        form={form}
        label='Número de cuenta'
        placeholder='Selecciona una cuenta'
        isRequired
        className='w-[324px] mt-3'
        items={options}
        disabled={options.length === 0}
      />

      <Separator className='my-4' />

      {/* Offers Visualization Section */}
      {/* Offers Visualization Section */}
      <span className='text-gray-500 text-base font-semibold leading-normal'>
        Visualización de ofertas
      </span>
      <SwitchField
        id={`campaigns.${index}.isSimilarOffers`}
        form={form}
        label=''
        description='Al activar esta opción, las ofertas similares se mostrarán agrupadas. Al desactivarla, cada oferta aparecerá de forma individual, mostrando todos sus detalles específicos. Elija la opción que mejor se adapte a la experiencia que desea ofrecer a sus clientes y de su empresa'
        message='Activa para agrupar'
      />

      <Separator className='my-4' />

      {/* API Market Section */}
      <span className='text-gray-500 text-base font-semibold leading-normal'>
        API Market
      </span>
      <p className='text-gray-600 text-sm font-normal leading-snug mt-2 mb-1'>
        Selecciona el usuario que estará habilitado con el módulo de Programa
        Cashback.
      </p>
      <div className='flex justify-between items-center'>
        <p className='text-gray-800 text-sm font-semibold leading-snug'>
          Usuario Habilitado: {form.watch(`campaigns.${index}.apiMarket`)?.name}
        </p>
        <Button
          type='button'
          variant='secondary'
          onClick={onOpenApiMarketModal}
          disabled={apiMarketClients.length === 0}
        >
          Usuario API Market
        </Button>
      </div>
      {form.formState.errors.campaigns?.[index]?.apiMarket?.name && (
        <p className='text-destructive text-sm font-normal leading-snug mt-2 mb-1'>
          Se requiere un usuario API Market
        </p>
      )}

      <Separator className='my-4' />

      {/* Duration Section */}
      <span className='text-gray-500 text-base font-semibold leading-normal'>
        Duración
      </span>
      <p className='text-gray-600 text-sm font-normal leading-snug mt-2 mb-1'>
        La duración del programa Cashback será indefinida, según lo establecido
        en el contrato firmado por el negocio.
      </p>

      <Separator className='my-4' />

      {/* Days Check Section */}
      <DaysCheckField
        form={form}
        id={`campaigns.${index}.days`}
        index={index}
        isEdit={isEdit}
      />

      <Separator className='my-4' />

      {/* Purchase Limits Section */}
      <span className='text-gray-500 text-base font-semibold leading-normal mb-4'>
        Límites por compra para el cliente
      </span>
      <CheckboxField
        form={form}
        id={`campaigns.${index}.isPurchaseLimit`}
        label='Sin límites de compra.'
      />
      {!form.watch(`campaigns.${index}.isPurchaseLimit`) && (
        <div className='w-[688px] gap-4 flex mt-4 justify-start'>
          <ToggleInputField
            form={form}
            id={`campaigns.${index}.lowerPurchaseLimit`}
            label='Monto mínimo de compra desde (Bs.)'
            isRequired
            className='w-full'
            isEdit={isEdit}
          />
          <ToggleInputField
            form={form}
            id={`campaigns.${index}.upperPurchaseLimit`}
            label='Monto máximo de compra desde (Bs.)'
            isRequired
            className='w-full'
            isEdit={isEdit}
          />
        </div>
      )}

      {/* Cumulative Limits Section */}
      <span className='text-gray-500 text-base font-semibold leading-normal mt-4'>
        Límites acumulativos del cliente
      </span>
      <CheckboxField
        form={form}
        id={`campaigns.${index}.isDailyCumulativeLimit`}
        label='Sin límite diario acumulado'
        className='my-2'
      />
      {!form.watch(`campaigns.${index}.isDailyCumulativeLimit`) && (
        <NumberInputField
          id={`campaigns.${index}.dailyCumulativeLimit`}
          form={form}
          label='Monto máximo diario de compra hasta (Bs.)'
          isRequired
          className='w-[324px]'
          placeholder='Ingrese monto máximo'
        />
      )}

      <Separator className='my-4' />

      {/* Monthly Business Limit Section */}
      <span className='text-gray-500 text-base font-semibold leading-normal mb-2'>
        Límite mensual del negocio
      </span>
      <CheckboxField
        form={form}
        id={`campaigns.${index}.isMonthlyCumulativeLimit`}
        label='Sin límite mensual de beneficios por parte del negocio.'
        className='mb-2'
      />
      {!form.watch(`campaigns.${index}.isMonthlyCumulativeLimit`) && (
        <NumberInputField
          id={`campaigns.${index}.monthlyCumulativeLimit`}
          form={form}
          label='Beneficio máximo otorgado por el negocio (Bs.)'
          isRequired
          className='w-[324px]'
          placeholder='Ingrese monto máximo'
        />
      )}

      <Separator className='my-4' />

      {/* Cashback Percentage Section */}
      <span className='text-gray-500 text-base font-semibold leading-normal mb-2'>
        Porcentaje de Cashback
      </span>
      <section className='flex'>
        <PaymentMethodSection
          form={form}
          index={index}
          type='debitCard'
          onOpenPosCommerceModal={onOpenPosCommerceModal}
        />
        <PaymentMethodSection form={form} index={index} type='qr' />
      </section>
    </Card>
  );
};
