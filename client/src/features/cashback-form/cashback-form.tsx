import { Form } from '@/components/ui/form';
import { useQuery } from '@tanstack/react-query';
import { CashbackService } from '@/lib/services/cashback.service';
import { useSharedStore } from '@/lib/stores/shared.store';
import { useCashbackCompaniesStore } from '@/lib/stores/cashback-companies.store';
import { ApiMarketModal } from './modal/api-market-modal';
import { PosCodesCommerceModal } from './modal/pos-codes-commerce-modal';
import { useCashbackForm } from './cashback-form/hooks/use-cashback-form';
import { useCashbackSubmission } from './cashback-form/hooks/use-cashback-submission';
import { useCompanyData } from './cashback-form/hooks/use-company-data';
import { CampaignTabs } from './cashback-form/components/campaign-tabs';
import { CampaignFormSection } from './cashback-form/components/campaign-form-section';
import { FormActions } from './cashback-form/components/form-actions';

export const CashbackForm = () => {
  const staleTime = useSharedStore((state) => state.staleTime);
  const previousStep = useCashbackCompaniesStore((state) => state.previousStep);

  const {
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
    handleCancel,
    isEdit,
    apiMarketClients,
  } = useCashbackForm();

  const { data: paymentMethodsList } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => CashbackService.getPaymentMethods(),
    staleTime: staleTime,
  });

  const { onSubmit, companyStatus, campaignStatus } =
    useCashbackSubmission(paymentMethodsList);

  const { isCompanyDataLoading } = useCompanyData(
    form.watch(`campaigns.${currentFormIndex}.nit`),
    enabled,
    currentFormIndex,
    setOptions
  );

  const isSubmitting =
    companyStatus === 'pending' || campaignStatus === 'pending';

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`flex flex-col w-full ${
            isSubmitting
              ? 'pointer-events-none animate-pulse'
              : 'pointer-events-auto'
          }`}
        >
          <CampaignTabs
            fields={fields}
            indexSelected={indexSelected}
            setIndexSelected={setIndexSelected}
            onAddCampaign={addNewCampaign}
            onRemoveCampaign={removeCampaign}
          />

          {fields.map((field, index) => (
            <CampaignFormSection
              key={field.id}
              form={form}
              index={index}
              isVisible={index === indexSelected}
              options={options}
              isCompanyDataLoading={isCompanyDataLoading}
              isEdit={isEdit}
              apiMarketClients={apiMarketClients}
              onSearchCompanyData={() => searchCompanyData(index)}
              onOpenApiMarketModal={() => openApiMarketModal(index)}
              onOpenPosCommerceModal={() => openPosCommerceModal(index)}
            />
          ))}

          <FormActions
            onCancel={handleCancel}
            onPrevious={previousStep}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </>
  );
};
