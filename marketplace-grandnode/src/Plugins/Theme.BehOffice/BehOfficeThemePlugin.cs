using Grand.Business.Core.Interfaces.Common.Configuration;
using Grand.Domain.Stores;
using Grand.Infrastructure.Plugins;

namespace Theme.BehOffice;

public class BehOfficeThemePlugin(ISettingService settingService) : BasePlugin, IPlugin
{
    public override async Task Install()
    {
        var storeInformation = await settingService.LoadSetting<StoreInformationSettings>();
        storeInformation.DefaultStoreTheme = "BehOffice";
        storeInformation.AllowCustomerToSelectTheme = false;
        await settingService.SaveSetting(storeInformation);

        await base.Install();
    }
}
