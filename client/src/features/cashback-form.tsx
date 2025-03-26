import { cashbackSchema } from '@/_cashback-companies/validations/cashback.schema';
import { InputField } from '@/components/fields/input-field';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ApiMarketModal } from '../modal/api-market-modal';
import { useModalStore } from '@/lib/stores/modal.store';
import { SelectField } from '@/components/fields/select-field';
import { DaysCheckField } from '../days-check-field/days-check-field';
import { CheckboxField } from '@/components/fields/checkbox-field';
import { ToggleInputField } from '@/components/fields/toggle-input.field';
import { NumberInputField } from '@/components/fields/number-input-field';
import { PaymentMethodFields } from '../payment-method-fields/payment-method-fields';
import { useSharedStore } from '@/lib/stores/shared.store';
import { useNavigate } from 'react-router-dom';
import { useCashbackCompaniesStore } from '@/lib/stores/cashback-companies.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { CashbackService } from '@/lib/services/cashback.service';
import { Spinner } from '@/components/ui/spinner';
import { PlusIcon, XIcon } from 'lucide-react';
import { format, set } from 'date-fns';
import { useParamsStore } from '@/lib/stores/params.store';
import {
  Campaign,
  CreateUpdateCampaignsParams,
  PaymentMethod,
} from '@/lib/interfaces/create-update-campaigns-params';
import { SuccessModal } from '@/components/shared/success-modal';
import { SwitchField } from '@/components/fields/switch-field';
import { APIMarketClient } from '@/lib/interfaces/api-market-client';
import { CreateUpdateApiMarketClientParams } from '@/lib/interfaces/create-update-api-market-client-params';
import { PosCodesCommerceModal } from '../modal/pos-codes-commerce-modal';
import { CampaignCommerce } from '@/lib/interfaces/campaign-commerce';
import { ErrorModal } from '@/components/shared/error-modal';

export const CashbackForm = () => {
  const queryClient = useQueryClient();
  const [enabled, setEnabled] = useState(false);
  const [options, setOptions] = useState([]);
  const [indexSelected, setIndexSelected] = useState(0);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const openModal = useModalStore((state) => state.openModal);
  const pathname = useSharedStore((state) => state.pathname);
  const staleTime = useSharedStore((state) => state.staleTime);
  const userId = useParamsStore((state) => state.userId);

  const navigate = useNavigate();
  const previousStep = useCashbackCompaniesStore((state) => state.previousStep);
  const resetStep = useCashbackCompaniesStore((state) => state.resetStep);
  const company = useCashbackCompaniesStore((state) => state.company);
  const isEdit = useCashbackCompaniesStore((state) => state.isEdit);
  const setApiMarketClients = useCashbackCompaniesStore(
    (state) => state.setApiMarketClients
  );
  const apiMarketClients = useCashbackCompaniesStore(
    (state) => state.apiMarketClients
  );
  const campaigns = useCashbackCompaniesStore((state) => state.campaigns);
  const resetValues = useCashbackCompaniesStore((state) => state.resetValues);

  const form = useForm<z.infer<typeof cashbackSchema>>({
    resolver: zodResolver(cashbackSchema),
    defaultValues: {
      campaigns: isEdit
        ? campaigns
        : [
            {
              name: '',
              email: '',
              nit: '',
              accountNumber: '',
              isSimilarOffers: false,
              apiMarket: {
                id: 0,
                isActive: false,
                documentNumber: 0,
                name: '',
              },
              posCodesCommerce: [],
              days: [],
              isPurchaseLimit: false,
              lowerPurchaseLimit: '',
              upperPurchaseLimit: '',
              isDailyCumulativeLimit: false,
              dailyCumulativeLimit: '',
              isMonthlyCumulativeLimit: false,
              monthlyCumulativeLimit: '',
              isDebitCardPayment: false,
              debitCardGlobalPercentage: '',
              debitCardClientPercentage: '',
              debitCardCompanyPercentage: 50,
              debitCardBnbPercentage: 50,
              isQRPayment: false,
              qrGlobalPercentage: '',
              qrClientPercentage: '',
              qrCompanyPercentage: 50,
              qrBnbPercentage: 50,
            },
          ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'campaigns',
  });

  const { data: paymentMethodsList } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => CashbackService.getPaymentMethods(),
    staleTime: staleTime,
  });
  const useCreateOrUpdateCompany = () => {
    return useMutation({
      mutationFn: isEdit
        ? CashbackService.updateCompany
        : CashbackService.createCompany,
    });
  };
  const { mutateAsync, status } = useCreateOrUpdateCompany();

  const useCreateOrUpdateCampaigns = () => {
    return useMutation({
      mutationFn: (variables: {
        isEdit: boolean;
        showSuccessModal?: boolean;
        params: CreateUpdateCampaignsParams;
      }) => {
        const { isEdit, params } = variables;
        return isEdit
          ? CashbackService.updateCampaigns(params)
          : CashbackService.createCampaigns(params);
      },
      onSuccess: (_, { isEdit, showSuccessModal = true }) => {
        if (isEdit) {
          queryClient.invalidateQueries({
            queryKey: ['company-detail', company?.id],
          });
          queryClient.invalidateQueries({
            queryKey: ['campaigns', company?.id],
          });
        }
        if (showSuccessModal)
          openModal({
            id: 'success-modal',
            children: (
              <SuccessModal
                title={`Se ${
                  isEdit ? 'actualizó' : 'registró'
                } exitosamente a la empresa ${company?.tradeName}`}
                description='El cliente podrá hacer uso del Cashback según las condiciones acordadas'
                buttonText='Aceptar'
                onClick={() => {
                  navigate(`${pathname}/Negocios`);
                  previousStep();
                }}
              />
            ),
            beforeModalClose: () => {
              navigate(`${pathname}/Negocios`);
              previousStep();
            },
          });
      },
    });
  };

  const { mutateAsync: campaignMutate, status: campaignStatus } =
    useCreateOrUpdateCampaigns();

  const onSubmit = async (values: z.infer<typeof cashbackSchema>) => {
    // console.log(values);
    const newCompanyId = await mutateAsync(company!);

    const now = new Date();
    const startOfDay = set(now, {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    const params = {
      campaigns: values.campaigns.map((campaign, index: number) => {
        const paymentMethods: PaymentMethod[] = [];
        if (campaign.isDebitCardPayment)
          paymentMethods.push({
            paymentMethodId: paymentMethodsList.find(
              (item: { description: string; id: string }) =>
                item.description === 'Tarjeta de débito'
            )?.id,
            globalPartialRefund: parseFloat(
              campaign.debitCardGlobalPercentage!
            ).toFixed(2),
            partialRefund: parseFloat(
              campaign.debitCardClientPercentage!
            ).toFixed(2),
            companyPartialRefund: (
              (parseFloat(campaign.debitCardClientPercentage!)! *
                campaign.debitCardCompanyPercentage!) /
              100
            ).toFixed(2),
            bnbPartialRefund: (
              (parseFloat(campaign.debitCardClientPercentage!)! *
                campaign.debitCardBnbPercentage!) /
              100
            ).toFixed(2),
          });
        if (campaign.isQRPayment)
          paymentMethods.push({
            paymentMethodId: paymentMethodsList.find(
              (item: { description: string; id: string }) =>
                item.description === 'Código QR'
            )?.id,
            globalPartialRefund: parseFloat(
              campaign.qrGlobalPercentage!
            ).toFixed(2),
            partialRefund: parseFloat(campaign.qrClientPercentage!).toFixed(2),
            companyPartialRefund: (
              (parseFloat(campaign.qrClientPercentage!)! *
                campaign.qrCompanyPercentage!) /
              100
            ).toFixed(2),
            bnbPartialRefund: (
              (parseFloat(campaign.qrClientPercentage!)! *
                campaign.qrBnbPercentage!) /
              100
            ).toFixed(2),
          });
        const campaignData: Campaign = {
          documentNumber: parseInt(campaign.nit),
          description: isEdit
            ? campaigns?.[index]?.description ?? 'Cashback para '
            : 'Cashback para ',
          detail: {
            startedAt: format(startOfDay, 'yyyy-MM-dd HH:mm'),
            concludedAt: '2040-12-31 23:59', //TODO valor hardcode para 2040
            isMondayAvailable: campaign.days.includes('Monday' as const),
            mondayStartedAt: campaign.days.includes('Monday' as const)
              ? campaign.MondayStartAt
              : '',
            mondayConcludedAt: campaign.days.includes('Monday' as const)
              ? campaign.MondayEndAt
              : '',
            isTuesdayAvailable: campaign.days.includes('Tuesday' as const),
            tuesdayStartedAt: campaign.days.includes('Tuesday' as const)
              ? campaign.TuesdayStartAt
              : '',
            tuesdayConcludedAt: campaign.days.includes('Tuesday' as const)
              ? campaign.TuesdayEndAt
              : '',
            isWednesdayAvailable: campaign.days.includes('Wednesday' as const),
            wednesdayStartedAt: campaign.days.includes('Wednesday' as const)
              ? campaign.WednesdayStartAt
              : '',
            wednesdayConcludedAt: campaign.days.includes('Wednesday' as const)
              ? campaign.WednesdayEndAt
              : '',
            isThursdayAvailable: campaign.days.includes('Thursday' as const),
            thursdayStartedAt: campaign.days.includes('Thursday' as const)
              ? campaign.ThursdayStartAt
              : '',
            thursdayConcludedAt: campaign.days.includes('Thursday' as const)
              ? campaign.ThursdayEndAt
              : '',
            isFridayAvailable: campaign.days.includes('Friday' as const),
            fridayStartedAt: campaign.days.includes('Friday' as const)
              ? campaign.FridayStartAt
              : '',
            fridayConcludedAt: campaign.days.includes('Friday' as const)
              ? campaign.FridayEndAt
              : '',
            isSaturdayAvailable: campaign.days.includes('Saturday' as const),
            saturdayStartedAt: campaign.days.includes('Saturday' as const)
              ? campaign.SaturdayStartAt
              : '',
            saturdayConcludedAt: campaign.days.includes('Saturday' as const)
              ? campaign.SaturdayEndAt
              : '',
            isSundayAvailable: campaign.days.includes('Sunday' as const),
            sundayStartedAt: campaign.days.includes('Sunday' as const)
              ? campaign.SundayStartAt
              : '',
            sundayConcludedAt: campaign.days.includes('Sunday' as const)
              ? campaign.SundayEndAt
              : '',
            isPurchaseLimitless: campaign.isPurchaseLimit,
            lowerPurchaseLimit: campaign.isPurchaseLimit
              ? 0
              : campaign.lowerPurchaseLimit === '0.00'
              ? 0
              : parseFloat(campaign.lowerPurchaseLimit!).toFixed(2),
            upperPurchaseLimit: campaign.isPurchaseLimit
              ? 99999999.99
              : campaign.upperPurchaseLimit === '0.00'
              ? 99999999.99
              : parseFloat(campaign.upperPurchaseLimit!).toFixed(2),
            isDailyCumulativeLimitless: campaign.isDailyCumulativeLimit,
            dailyCumulativeLimit: campaign.isDailyCumulativeLimit
              ? 0
              : parseFloat(campaign.dailyCumulativeLimit!).toFixed(2),
            isMonthlyLimitless: campaign.isMonthlyCumulativeLimit,
            monthlyLimit: campaign.isMonthlyCumulativeLimit
              ? 0
              : parseFloat(campaign.monthlyCumulativeLimit!).toFixed(2),
          },
          paymentMethods: paymentMethods,

          account: {
            number: parseInt(campaign.accountNumber),
          },
          campaignName: campaign.name,
          email: campaign.email,
          isSimilarOffers: campaign.isSimilarOffers ? true : false,
        };
        if (isEdit) {
          const campaign = campaigns[index];

          if (campaign?.id) {
            campaignData.updatedBy = userId!;
            campaignData.id = campaign.id;
          } else {
            campaignData.createdBy = userId!;
            campaignData.companyId = newCompanyId;
          }
        } else {
          campaignData.createdBy = userId!;
          campaignData.companyId = newCompanyId;
        }
        return campaignData;
      }),
    };
    // console.log(params);
    let response: string[];
    if (!isEdit) {
      response = await campaignMutate({
        isEdit: isEdit,
        params: params as unknown as CreateUpdateCampaignsParams,
      });
    } else {
      if (params.campaigns.length === campaigns.length) {
        response = await campaignMutate({
          isEdit: isEdit,
          params: params as unknown as CreateUpdateCampaignsParams,
        });
      } else if (params.campaigns.length > campaigns.length) {
        const existingCampaigns = params.campaigns.slice(0, campaigns.length);
        const newCampaigns = params.campaigns.slice(campaigns.length);

        const responseUpdateExistingCampaign = await campaignMutate({
          isEdit: true,
          showSuccessModal: false,
          params: {
            campaigns: existingCampaigns,
          } as unknown as CreateUpdateCampaignsParams,
        });

        const responseCreateNewCampaign = await campaignMutate({
          isEdit: false,
          params: {
            campaigns: newCampaigns,
          } as unknown as CreateUpdateCampaignsParams,
        });
        response = [
          ...responseUpdateExistingCampaign,
          ...responseCreateNewCampaign,
        ];
      } else {
        response = await campaignMutate({
          isEdit: true,
          params: params as unknown as CreateUpdateCampaignsParams,
        });
        const paramsCampaignIds = new Set(params.campaigns.map((c) => c.id));
        const removedCampaigns = campaigns.filter(
          (c) => !paramsCampaignIds.has(c.id)
        );

        const removedCampaignIds = removedCampaigns.map((c) => c.id);
        for (const campaignId of removedCampaignIds) {
          await CashbackService.UpdateCampaignIsActive({
            id: campaignId,
            isActive: false,
          });
        }
      }
    }
    const mapCampaigns = (
      campaigns: { apiMarket: APIMarketClient }[],
      actionBy: string,
      startIndex: number = 0
    ) =>
      campaigns.map((campaign, index: number) => ({
        campaignId: response[startIndex + index],
        campaignOpenBankingClients: [
          {
            id: campaign.apiMarket.id!,
            reference: campaign.apiMarket.name!,
          },
        ],
        [actionBy]: userId,
      }));
    if (!isEdit) {
      for (const param of mapCampaigns(values.campaigns, 'createdBy')) {
        await CashbackService.createApiMarketClient(
          param as CreateUpdateApiMarketClientParams
        );
      }
      return response;
    } else {
      if (values.campaigns.length > campaigns.length) {
        const [existingCampaigns, newCampaigns] = [
          values.campaigns.slice(0, campaigns.length),
          values.campaigns.slice(campaigns.length),
        ];

        for (const param of mapCampaigns(
          newCampaigns,
          'createdBy',
          campaigns.length
        )) {
          await CashbackService.createApiMarketClient(
            param as CreateUpdateApiMarketClientParams
          );
        }

        for (const param of mapCampaigns(existingCampaigns, 'updatedBy')) {
          await CashbackService.updateApiMarketClient(
            param as CreateUpdateApiMarketClientParams
          );
        }
      } else {
        for (const param of mapCampaigns(values.campaigns, 'updatedBy')) {
          await CashbackService.updateApiMarketClient(
            param as CreateUpdateApiMarketClientParams
          );
        }
      }
    }
    resetValues();
    return response;
  };
  const setApiMarketValue = (index: number, value: APIMarketClient) => {
    form.setValue(`campaigns.${index}.apiMarket`, value);
  };
  const openApiMarketModal = (index: number) => {
    openModal({
      id: 'api-market-modal',
      children: (
        <ApiMarketModal
          setApiMarketValue={setApiMarketValue}
          index={index}
          currentId={form.watch(`campaigns.${index}.apiMarket.id`)}
        />
      ),
      className: 'w-[1930px]!',
    });
  };
  const setPosCodesCommerce = (index: number, value: CampaignCommerce[]) => {
    form.setValue(`campaigns.${index}.posCodesCommerce`, value);
  };
  const openPosCommerceModal = (index: number) => {
    if (!campaigns[index].id) return;
    openModal({
      id: 'pos-codes-commerce-modal',
      children: (
        <PosCodesCommerceModal
          index={index}
          campaignId={campaigns[index].id}
          setValues={setPosCodesCommerce}
        />
      ),
      className: 'w-[1930px]!',
    });
  };
  const searchCompanyData = (index: number) => {
    setCurrentFormIndex(index);
    setEnabled(true);
  };

  const { data: companyData, isFetching: isCompanyDataLoading } = useQuery({
    queryKey: ['company-data', form.watch(`campaigns.${currentFormIndex}.nit`)],
    queryFn: () =>
      CashbackService.getCompanyData(
        form.watch(`campaigns.${currentFormIndex}.nit`)
      ),
    enabled: enabled,
    staleTime: staleTime,
  });
  const { data: apiMarketClientsData } = useQuery({
    queryKey: [
      'api-market-clients',
      form.watch(`campaigns.${currentFormIndex}.nit`),
    ],
    queryFn: () =>
      CashbackService.getApiMarketClients(
        form.watch(`campaigns.${currentFormIndex}.nit`)
      ),
    enabled: enabled,
    staleTime: staleTime,
  });
  useEffect(() => {
    if (companyData) {
      setOptions(
        companyData.account.map((item: { number: number }) => ({
          name: item.number,
          id: item.number,
        }))
      );
    }
    if (companyData && apiMarketClientsData) {
      setEnabled(false);
    }
  }, [companyData, apiMarketClientsData, setOptions]);
  useEffect(() => {
    if (apiMarketClientsData) {
      setApiMarketClients(apiMarketClientsData);
    }
    if (companyData && apiMarketClientsData) {
      setEnabled(false);
    }
  }, [apiMarketClientsData, setApiMarketClients, companyData]);
  console.log(form.formState.errors);

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      const campaignsErrors = Array.isArray(form.formState.errors?.campaigns)
        ? form.formState.errors.campaigns
            .filter((campaign) => campaign !== null)
            .flatMap((campaignError) =>
              Object.values(campaignError).flatMap((value) => {
                if (typeof value === 'object' && value !== null) {
                  if ('message' in value) {
                    return value.message;
                  }
                  return Object.values(value)
                    .filter(
                      (subError) =>
                        typeof subError === 'object' &&
                        subError !== null &&
                        'message' in subError
                    )
                    .map((subError) => subError.message);
                }
                return null;
              })
            )
            .filter(Boolean)
            .join('.\n')
        : '';

      if (campaignsErrors) {
        console.log(campaignsErrors);
        openModal({
          id: 'error-modal',
          children: (
            <ErrorModal
              title='Campos requeridos'
              description={campaignsErrors}
            />
          ),
        });
      }
    }
  }, [form.formState.errors]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`flex flex-col w-full ${
            status === 'pending' || campaignStatus === 'pending'
              ? 'pointer-events-none animate-pulse'
              : 'pointer-events-auto'
          }`}
        >
          <div className='flex justify-between mb-4'>
            <div className='flex gap-[9px]'>
              {fields.map((item, index) => (
                <div
                  className={`rounded-md px-2 py-1 flex gap-2 items-center cursor-pointer ${
                    index === indexSelected
                      ? 'bg-primary-2 text-primary'
                      : 'bg-primary-3 text-gray-400'
                  }`}
                  key={item.id + index}
                  onClick={() => setIndexSelected(index)}
                >
                  <span className='text-sm font-medium leading-tight'>
                    Oferta {index + 1}
                  </span>
                  {index !== 0 && (
                    <Button
                      size='icon'
                      variant='ghost'
                      className='p-0! h-3 w-3'
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        setIndexSelected(0);
                        remove(index);
                        console.log('remove', index);
                        console.log(fields[index].name);
                      }}
                    >
                      <XIcon className='size-2.5' />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={() =>
                append({
                  name: '',
                  email: '',
                  nit: '',
                  accountNumber: '',
                  isSimilarOffers: false,
                  apiMarket: {
                    id: 0,
                    isActive: false,
                    documentNumber: 0,
                    name: '',
                  },
                  posCodesCommerce: [],
                  days: [],
                  isPurchaseLimit: false,
                  lowerPurchaseLimit: '',
                  upperPurchaseLimit: '',
                  isDailyCumulativeLimit: false,
                  dailyCumulativeLimit: '',
                  isMonthlyCumulativeLimit: false,
                  monthlyCumulativeLimit: '',
                  isDebitCardPayment: false,
                  debitCardGlobalPercentage: '',
                  debitCardClientPercentage: '',
                  debitCardCompanyPercentage: 50,
                  debitCardBnbPercentage: 50,
                  isQRPayment: false,
                  qrGlobalPercentage: '',
                  qrClientPercentage: '',
                  qrCompanyPercentage: 50,
                  qrBnbPercentage: 50,
                })
              }
              disabled={fields.length === 3}
              size='sm'
              type='button'
            >
              <PlusIcon className='mr-1' />
              Añadir oferta
            </Button>
          </div>
          {fields.map(
            (field, index) => (
              // indexSelected === index && (
              <Card
                className={`p-8 bg-gray-100 w-full gap-0 ${
                  index === indexSelected ? '' : 'hidden'
                }`}
                key={field.id + index}
              >
                <h3 className='text-gray-80 text-xl font-semibold leading-7'>
                  Datos Cashback
                </h3>
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
                <span className='text-gray-500 text-base font-semibold leading-normal'>
                  NIT y Cuenta destino
                </span>
                <p className='text-gray-600 text-sm font-normal leading-snug mt-2 mb-1'>
                  Ingresa el NIT asociado a tu negocio.
                </p>
                <div
                  className={`flex gap-5 items-end ${
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
                    onEnterPress={() => searchCompanyData(index)}
                    onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
                      (e.target as HTMLInputElement).blur()
                    }
                  />
                  <Button
                    type='button'
                    onClick={() => searchCompanyData(index)}
                    className={
                      form.formState.errors.campaigns?.[index]?.nit
                        ? 'mt-6'
                        : ''
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
                {/* {index === 0 && (
                    <> */}
                <Separator className='my-4' />
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
                {/* </>
                  )} */}
                <Separator className='my-4' />
                <span className='text-gray-500 text-base font-semibold leading-normal'>
                  API Market
                </span>
                <p className='text-gray-600 text-sm font-normal leading-snug mt-2 mb-1'>
                  Selecciona el usuario que estará habilitado con el módulo de
                  Programa Cashback.
                </p>
                <div className='flex justify-between items-center'>
                  <p className='text-gray-800 text-sm font-semibold leading-snug'>
                    Usuario Habilitado:{' '}
                    {form.watch(`campaigns.${index}.apiMarket`)?.name}
                  </p>
                  <Button
                    type='button'
                    variant='secondary'
                    onClick={() => openApiMarketModal(index)}
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
                <span className='text-gray-500 text-base font-semibold leading-normal'>
                  Duración
                </span>
                <p className='text-gray-600 text-sm font-normal leading-snug mt-2 mb-1'>
                  La duración del programa Cashback será indefinida, según lo
                  establecido en el contrato firmado por el negocio.
                </p>
                <Separator className='my-4' />
                <DaysCheckField
                  form={form}
                  id={`campaigns.${index}.days`}
                  index={index}
                  isEdit={isEdit}
                />
                <Separator className='my-4' />
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
                <span className='text-gray-500 text-base font-semibold leading-normal mb-2'>
                  Porcentaje de Cashback
                </span>
                <section className='flex'>
                  <div className='w-full flex flex-col'>
                    <div className='h-12 p-3 bg-gray-badge flex justify-center'>
                      <p className='text-center text-sm font-medium leading-snug'>
                        Tarjetas de Débito
                      </p>
                    </div>
                    <div className='py-3 px-6 bg-gray-100 flex flex-col gap-y-5'>
                      <CheckboxField
                        form={form}
                        id={`campaigns.${index}.isDebitCardPayment`}
                        label='Configurar método de pago con Tarjeta.'
                        className='bg-transparent'
                      />
                      {form.watch(`campaigns.${index}.isDebitCardPayment`) && (
                        <PaymentMethodFields
                          form={form}
                          fields={[
                            {
                              id: `campaigns.${index}.debitCardGlobalPercentage`,
                              label: 'Porcentaje de débito al negocio (%)',
                              placeholder: 'Ingresa el porcentaje',
                            },
                            {
                              id: `campaigns.${index}.debitCardClientPercentage`,
                              label:
                                'Porcentaje de Cashback otorgado al cliente (%)',
                              placeholder: 'Ingresa el porcentaje',
                            },
                            {
                              id: `campaigns.${index}.debitCardCompanyPercentage`,
                            },
                            {
                              id: `campaigns.${index}.debitCardBnbPercentage`,
                            },
                          ]}
                        >
                          <Button
                            variant='secondary'
                            type='button'
                            className='w-fit mx-auto'
                            onClick={() => openPosCommerceModal(index)}
                          >
                            Códigos de Comercio
                          </Button>
                        </PaymentMethodFields>
                      )}
                    </div>
                  </div>
                  <div className='w-full flex flex-col'>
                    <div className='h-12 p-3 bg-[#EFECF3] flex justify-center'>
                      <p className='text-primary text-sm font-medium leading-snug'>
                        Código QR
                      </p>
                    </div>
                    <div className='py-3 px-6 bg-white flex flex-col gap-y-5 flex-grow'>
                      <CheckboxField
                        form={form}
                        id={`campaigns.${index}.isQRPayment`}
                        label='Configurar método de pago con QR.'
                        className='bg-transparent'
                      />
                      {form.watch(`campaigns.${index}.isQRPayment`) && (
                        <PaymentMethodFields
                          form={form}
                          fields={[
                            {
                              id: `campaigns.${index}.qrGlobalPercentage`,
                              label: 'Porcentaje de débito al negocio (%)',
                              placeholder: 'Ingresa el porcentaje',
                            },
                            {
                              id: `campaigns.${index}.qrClientPercentage`,
                              label:
                                'Porcentaje de Cashback otorgado al cliente (%)',
                              placeholder: 'Ingresa el porcentaje',
                            },
                            {
                              id: `campaigns.${index}.qrCompanyPercentage`,
                            },
                            {
                              id: `campaigns.${index}.qrBnbPercentage`,
                            },
                          ]}
                        />
                      )}
                    </div>
                  </div>
                </section>
              </Card>
            )
            // )
          )}
          <div className='flex justify-between mt-8'>
            <Button
              variant='destructive'
              type='button'
              onClick={() => {
                navigate(`${pathname}/Negocios`);
                resetStep();
              }}
            >
              Cancelar registro
            </Button>
            <div className='w-fit flex gap-5'>
              <Button type='button' onClick={previousStep}>
                Anterior
              </Button>
              <Button type='submit'>
                {status === 'pending' || campaignStatus === 'pending' ? (
                  <Spinner size='small' />
                ) : (
                  'Finalizar registro'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
