import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cashbackSchema } from '@/_cashback-companies/validations/cashback.schema';
import { useCashbackCompaniesStore } from '@/lib/stores/cashback-companies.store';
import { useEffect, useState } from 'react';
import { useParamsStore } from '@/lib/stores/params.store';
import { useSharedStore } from '@/lib/stores/shared.store';
import { useNavigate } from 'react-router-dom';
import { useModalStore } from '@/lib/stores/modal.store';
import { SuccessModal } from '@/components/shared/success-modal';
import { ErrorModal } from '@/components/shared/error-modal';
import { APIMarketClient } from '@/lib/interfaces/api-market-client';
import { CampaignCommerce } from '@/lib/interfaces/campaign-commerce';

export const useCashbackForm = () => {
  const [indexSelected, setIndexSelected] = useState(0);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [options, setOptions] = useState([]);

  const navigate = useNavigate();
  const openModal = useModalStore((state) => state.openModal);
  const pathname = useSharedStore((state) => state.pathname);
  const userId = useParamsStore((state) => state.userId);

  const {
    previousStep,
    resetStep,
    company,
    isEdit,
    setApiMarketClients,
    apiMarketClients,
    campaigns,
    resetValues,
  } = useCashbackCompaniesStore();

  const form = useForm<z.infer<typeof cashbackSchema>>({
    resolver: zodResolver(cashbackSchema),
    defaultValues: {
      campaigns: isEdit ? campaigns : [getDefaultCampaign()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'campaigns',
  });

  const setApiMarketValue = (index: number, value: APIMarketClient) => {
    form.setValue(`campaigns.${index}.apiMarket`, value);
  };

  const setPosCodesCommerce = (index: number, value: CampaignCommerce[]) => {
    form.setValue(`campaigns.${index}.posCodesCommerce`, value);
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

  const openPosCommerceModal = (index: number) => {
    if (!campaigns[index]?.id) return;
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

  const addNewCampaign = () => {
    append(getDefaultCampaign());
  };

  const removeCampaign = (index: number) => {
    setIndexSelected(0);
    remove(index);
  };

  const handleCancel = () => {
    navigate(`${pathname}/Negocios`);
    resetStep();
  };

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
  }, [form.formState.errors, openModal]);

  return {
    form,
    fields,
    indexSelected,
    setIndexSelected,
    currentFormIndex,
    enabled,
    options,
    setOptions,
    addNewCampaign,
    removeCampaign,
    searchCompanyData,
    openApiMarketModal,
    openPosCommerceModal,
    setApiMarketValue,
    setPosCodesCommerce,
    handleCancel,
    isEdit,
    apiMarketClients,
  };
};

function getDefaultCampaign() {
  return {
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
  };
}
