using Grand.Business.Core.Interfaces.Authentication;
using Grand.Domain.Stores;
using Microsoft.AspNetCore.Http;

namespace Grand.Web.Common.Themes;

public class ThemeContext : ThemeContextBase
{
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly StoreInformationSettings _storeInformationSettings;
    private string _themeName;

    public ThemeContext(IHttpContextAccessor contextAccessor, ICookieOptionsFactory cookieOptionsFactory,
        StoreInformationSettings storeInformationSettings) : base(contextAccessor, cookieOptionsFactory)
    {
        _storeInformationSettings = storeInformationSettings;
        _contextAccessor = contextAccessor;
    }

    public override string AreaName => "";

    public override string GetCurrentTheme()
    {
        if (!string.IsNullOrEmpty(_themeName))
            return _themeName;

        // This is a single-brand marketplace. Theme selection is intentionally
        // locked so stale settings or cookies cannot expose GrandNode themes.
        return _themeName = "BehOffice";
    }
}
