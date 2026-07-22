using Grand.Business.Core.Interfaces.Common.Configuration;
using Grand.Infrastructure;
using Grand.Web.Common.Controllers;
using Microsoft.AspNetCore.Mvc;
using Payments.CashOnDelivery.Models;

namespace Payments.CashOnDelivery.Controllers;

public class PaymentCashOnDeliveryController : BasePaymentController
{
    private readonly ISettingService _settingService;
    private readonly IContextAccessor _contextAccessor;

    public PaymentCashOnDeliveryController(
        IContextAccessor contextAccessor,
        ISettingService settingService)
    {
        _contextAccessor = contextAccessor;
        _settingService = settingService;
    }

    public async Task<IActionResult> PaymentInfo()
    {
        var cashOnDeliveryPaymentSettings = await _settingService.LoadSetting<CashOnDeliveryPaymentSettings>(_contextAccessor.StoreContext.CurrentStore.Id);

        var model = new PaymentInfoModel {
            DescriptionText = string.IsNullOrWhiteSpace(cashOnDeliveryPaymentSettings.DescriptionText)
                ? "<p><strong>Tu pedido quedará pendiente de confirmación.</strong></p><p>BEH validará disponibilidad, transporte, ensamble e instalación. Después recibirás instrucciones de transferencia o anticipo desde nuestros canales oficiales.</p>"
                : cashOnDeliveryPaymentSettings.DescriptionText
        };

        return View(model);
    }
}
