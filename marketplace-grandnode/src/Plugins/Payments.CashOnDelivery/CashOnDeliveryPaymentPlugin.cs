using Grand.Business.Core.Interfaces.Common.Configuration;
using Grand.Business.Core.Interfaces.Common.Localization;
using Grand.Infrastructure.Plugins;

namespace Payments.CashOnDelivery;

/// <summary>
///     CashOnDelivery payment processor
/// </summary>
public class CashOnDeliveryPaymentPlugin(
    ISettingService settingService,
    IPluginTranslateResource pluginTranslateResource)
    : BasePlugin, IPlugin
{
    #region Methods

    /// <summary>
    ///     Gets a configuration page URL
    /// </summary>
    public override string ConfigurationUrl()
    {
        return CashOnDeliveryPaymentDefaults.ConfigurationUrl;
    }

    public override async Task Install()
    {
        var settings = new CashOnDeliveryPaymentSettings {
            DescriptionText =
                "<p><strong>Tu pedido quedará pendiente de confirmación.</strong></p><p>BEH validará disponibilidad, transporte, ensamble e instalación. Después recibirás las instrucciones de transferencia o anticipo por un canal oficial. No realices pagos a cuentas enviadas desde contactos distintos a los publicados por BEH.</p>",
            SkipPaymentInfo = true,
            ShippableProductRequired = false
        };
        await settingService.SaveSetting(settings);
        await pluginTranslateResource.AddOrUpdatePluginTranslateResource("Payments.CashOnDelivery.FriendlyName", "Transferencia bancaria o anticipo coordinado");
        await pluginTranslateResource.AddOrUpdatePluginTranslateResource("Plugins.Payment.CashOnDelivery.DescriptionText", "Información para el cliente");
        await pluginTranslateResource.AddOrUpdatePluginTranslateResource("Plugins.Payment.CashOnDelivery.DescriptionText.Hint",
            "Texto que se mostrará durante el checkout");
        await pluginTranslateResource.AddOrUpdatePluginTranslateResource("Plugins.Payment.CashOnDelivery.PaymentMethodDescription", "Transferencia bancaria o anticipo coordinado con BEH");
        await pluginTranslateResource.AddOrUpdatePluginTranslateResource("Plugins.Payment.CashOnDelivery.AdditionalFee", "Cargo adicional");
        await pluginTranslateResource.AddOrUpdatePluginTranslateResource("Plugins.Payment.CashOnDelivery.AdditionalFee.Hint", "Cargo adicional aplicado al pedido.");
        await pluginTranslateResource.AddOrUpdatePluginTranslateResource("Plugins.Payment.CashOnDelivery.AdditionalFeePercentage", "Usar porcentaje para el cargo");
        await pluginTranslateResource.AddOrUpdatePluginTranslateResource("Plugins.Payment.CashOnDelivery.AdditionalFeePercentage.Hint",
            "Si está activo, el cargo se calcula como porcentaje; de lo contrario es un valor fijo.");
        await pluginTranslateResource.AddOrUpdatePluginTranslateResource("Plugins.Payment.CashOnDelivery.ShippableProductRequired", "Exigir producto con envío");
        await pluginTranslateResource.AddOrUpdatePluginTranslateResource("Plugins.Payment.CashOnDelivery.ShippableProductRequired.Hint",
            "Limita este método a pedidos que requieren entrega.");
        await pluginTranslateResource.AddOrUpdatePluginTranslateResource("Plugins.Payment.CashOnDelivery.SkipPaymentInfo", "Omitir información de pago");
        await pluginTranslateResource.AddOrUpdatePluginTranslateResource("Plugins.Payment.CashOnDelivery.DisplayOrder", "Orden de visualización");


        await base.Install();
    }

    public override async Task Uninstall()
    {
        //settings
        await settingService.DeleteSetting<CashOnDeliveryPaymentSettings>();

        //locales
        await pluginTranslateResource.DeletePluginTranslationResource("Plugins.Payment.CashOnDelivery.DescriptionText");
        await pluginTranslateResource.DeletePluginTranslationResource("Plugins.Payment.CashOnDelivery.DescriptionText.Hint");
        await pluginTranslateResource.DeletePluginTranslationResource("Plugins.Payment.CashOnDelivery.PaymentMethodDescription");
        await pluginTranslateResource.DeletePluginTranslationResource("Plugins.Payment.CashOnDelivery.AdditionalFee");
        await pluginTranslateResource.DeletePluginTranslationResource("Plugins.Payment.CashOnDelivery.AdditionalFee.Hint");
        await pluginTranslateResource.DeletePluginTranslationResource("Plugins.Payment.CashOnDelivery.AdditionalFeePercentage");
        await pluginTranslateResource.DeletePluginTranslationResource("Plugins.Payment.CashOnDelivery.AdditionalFeePercentage.Hint");
        await pluginTranslateResource.DeletePluginTranslationResource("Plugins.Payment.CashOnDelivery.ShippableProductRequired");
        await pluginTranslateResource.DeletePluginTranslationResource("Plugins.Payment.CashOnDelivery.ShippableProductRequired.Hint");
        await pluginTranslateResource.DeletePluginTranslationResource("Plugins.Payment.CashOnDelivery.SkipPaymentInfo");

        await base.Uninstall();
    }

    #endregion
}
