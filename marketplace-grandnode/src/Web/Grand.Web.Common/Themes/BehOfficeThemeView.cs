namespace Grand.Web.Common.Themes;

public sealed class BehOfficeThemeView : IThemeView
{
    public string AreaName => "";
    public string ThemeName => "BehOffice";

    public ThemeInfo ThemeInfo => new(
        "BEH Office Marketplace",
        "~/Plugins/Theme.BehOffice/Content/theme.jpg",
        "Tienda BEH de mobiliario corporativo",
        false);

    public IEnumerable<string> GetViewLocations()
    {
        return [
            "/Views/BehOffice/{1}/{0}.cshtml",
            "/Views/BehOffice/Shared/{0}.cshtml",
            "/Views/{1}/{0}.cshtml",
            "/Views/Shared/{0}.cshtml"
        ];
    }
}
