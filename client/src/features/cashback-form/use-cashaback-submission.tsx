import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CashbackService } from '@/lib/services/cashback.service';
import { useCashbackCompaniesStore } from '@/lib/stores/cashback-companies.store';
import { useParamsStore } from '@/lib/stores/params.store';
import { useSharedStore } from '@/lib/stores/shared.store';
import { useNavigate } from 'react-router-dom';
import { useModalStore } from '@/lib/stores/modal.store';
import { SuccessModal } from '@/components/shared/success-modal';
import { format, set } from 'date-fns';
import { z } from 'zod';
import { cashbackSchema } from '@/_cashback-companies/validations/cashback.schema';
import { CreateUpdateCampaignsParams, PaymentMethod } from '@/lib/interfaces/create-update-campaigns-params';
import { CreateUpdateApiMarketClientParams } from '@/lib/interfaces/create-update-api-market-client-params';

export const useCashbackSubmission = (paymentMethodsList: any) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const openModal = useModalStore((state) => state.openModal);
  const pathname = useSharedStore((state) => state.pathname);
  const userId = useParamsStore((state) => state.userId);
  
  const { 
    previousStep, 
    company, 
    isEdit, 
    campaigns,
    resetValues
  } = useCashbackCompaniesStore();

  const useCreateOrUpdateCompany = () => {
    return useMutation({
      mutationFn: isEdit
        ? CashbackService.updateCompany
        : CashbackService.createCompany,
    });
  };

  const { mutateAsync: companyMutate, status: companyStatus } = useCreateOrUpdateCompany();

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

  const { mutateAsync: campaignMutate, status: campaignStatus } = useCreateOrUpdateCampaigns();

  const onSubmit = async (values: z.infer<typeof cashbackSchema>) => {
    const newCompanyId = await companyMutate(company!);

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
          paymentMethods.push(createPaymentMethod(campaign, 'debitCard', paymentMethodsList));
        if (campaign.isQRPayment)
          paymentMethods.push(createPaymentMethod(campaign, 'qr', paymentMethodsList));
        
        const campaignData = createCampaignData(campaign, index, startOfDay, paymentMethods);
        
        if (isEdit) {
          const existingCampaign = campaigns[index];
          if (existingCampaign?.id) {
            campaignData.updatedBy = userId!;
            campaignData.id = existingCampaign.id;
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

    let response: string[];
    
    if (!isEdit) {
      response = await campaignMutate({
        isEdit: isEdit,
        params: params as unknown as CreateUpdateCampaignsParams,
      });
    } else {
      response = await handleEditCampaigns(params, campaigns);
    }

    await handleApiMarketClients(values.campaigns, response);
    
    resetValues();
    return response;
  };

  const handleEditCampaigns = async (params: any, campaigns: any) => {
    if (params.campaigns.length === campaigns.length) {
      return await campaignMutate({
        isEdit: true,
        params: params as unknown as CreateUpdateCampaignsParams,
      });
    } else if (params.campaigns.length > campaigns.length) {
      return await handleAddingCampaigns(params, campaigns);
    } else {
      const response = await campaignMutate({
        isEdit: true,
        params: params as unknown as CreateUpdateCampaignsParams,
      });
      
      await handleRemovedCampaigns(params, campaigns);
      return response;
    }
  };

  const handleAddingCampaigns = async (params: any, campaigns: any) => {
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
    
    return [...responseUpdateExistingCampaign, ...responseCreateNewCampaign];
  };

  const handleRemovedCampaigns = async (params: any, campaigns: any) => {
    const paramsCampaignIds = new Set(params.campaigns.map((c: any) => c.id));
    const removedCampaigns = campaigns.filter(
      (c: any) => !paramsCampaignIds.has(c.id)
    );

    const removedCampaignIds = removedCampaigns.map((c: any) => c.id);
    for (const campaignId of removedCampaignIds) {
      await CashbackService.UpdateCampaignIsActive({
        id: campaignId,
        isActive: false,
      });
    }
  };

  const handleApiMarketClients = async (campaigns: any, response: string[]) => {
    const mapCampaigns = (
      campaigns: { apiMarket: any }[],
      actionBy: string,
      startIndex: number = 0
    ) =>
      campaigns.map((campaign, index: number) => ({
        campaignId: response[startIndex + index],
        campaignOpenBankingClients: [
          {
            id: campaign.apiMarket.id!,
            reference: campaign.apiMarket.name!,
            {
                id: campaign.apiMarket.id!,
                reference: campaign.apiMarket.name!,
              },
            ],
            [actionBy]: userId,
          }));
    
        if (!isEdit) {
          for (const param of mapCampaigns(campaigns, 'createdBy')) {
            await CashbackService.createApiMarketClient(
              param as CreateUpdateApiMarketClientParams
            );
          }
          return;
        } else {
          if (campaigns.length > campaigns.length) {
            const [existingCampaigns, newCampaigns] = [
              campaigns.slice(0, campaigns.length),
              campaigns.slice(campaigns.length),
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
            for (const param of mapCampaigns(campaigns, 'updatedBy')) {
              await CashbackService.updateApiMarketClient(
                param as CreateUpdateApiMarketClientParams
              );
            }
          }
        }
      };
    
      return {
        onSubmit,
        companyStatus,
        campaignStatus
      };
    };
    
    function createPaymentMethod(campaign: any, type: 'debitCard' | 'qr', paymentMethodsList: any) {
      const prefix = type === 'debitCard' ? 'debitCard' : 'qr';
      const description = type === 'debitCard' ? 'Tarjeta de débito' : 'Código QR';
      
      return {
        paymentMethodId: paymentMethodsList.find(
          (item: { description: string; id: string }) =>
            item.description === description
        )?.id,
        globalPartialRefund: parseFloat(
          campaign[`${prefix}GlobalPercentage`]!
        ).toFixed(2),
        partialRefund: parseFloat(
          campaign[`${prefix}ClientPercentage`]!
        ).toFixed(2),
        companyPartialRefund: (
          (parseFloat(campaign[`${prefix}ClientPercentage`]!)! *
            campaign[`${prefix}CompanyPercentage`]!) /
          100
        ).toFixed(2),
        bnbPartialRefund: (
          (parseFloat(campaign[`${prefix}ClientPercentage`]!)! *
            campaign[`${prefix}BnbPercentage`]!) /
          100
        ).toFixed(2),
      };
    }
    
    function createCampaignData(campaign: any, index: number, startOfDay: Date, paymentMethods: PaymentMethod[]) {
      return {
        documentNumber: parseInt(campaign.nit),
        description: campaign.description || 'Cashback para ',
        detail: {
          startedAt: format(startOfDay, 'yyyy-MM-dd HH:mm'),
          concludedAt: '2040-12-31 23:59', // Hardcoded value for 2040
          ...createDayAvailability(campaign),
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
    }
    
    function createDayAvailability(campaign: any) {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const result: Record<string, any> = {};
      
      days.forEach(day => {
        result[`is${day}Available`] = campaign.days.includes(day);
        result[`${day.toLowerCase()}StartedAt`] = campaign.days.includes(day) 
          ? campaign[`${day}StartAt`] 
          : '';
        result[`${day.toLowerCase()}ConcludedAt`] = campaign.days.includes(day) 
          ? campaign[`${day}EndAt`] 
          : '';
      });
      
      return result;
    }