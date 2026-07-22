using Grand.Web.Common.Themes;

namespace Grand.Web.Common.View;

public class DefaultAreaViewFactory : IAreaViewFactory
{
    private readonly IThemeContext _themeContext;

    private readonly IEnumerable<IThemeView> _themeFactories;

    public DefaultAreaViewFactory(IEnumerable<IThemeView> themeFactories, IThemeContextFactory themeContextFactory)
    {
        _themeContext = themeContextFactory.GetThemeContext(AreaName);
        _themeFactories = themeFactories.Where(x => x.AreaName == AreaName);
    }

    public string AreaName => "";

    public IEnumerable<string> GetViewLocations(IEnumerable<string> viewLocations)
    {
        const string themeName = "BehOffice";

        var themeViewLocations = _themeFactories
            .Where(x => x.ThemeName == themeName)
            .SelectMany(x => x.GetViewLocations())
            .ToList();
        return themeViewLocations.Any()
            ? themeViewLocations.Concat(GetDefaultViewLocations())
            : GetDefaultViewLocations();
    }

    private static IEnumerable<string> GetDefaultViewLocations()
    {
        return new List<string> {
            "/Views/{1}/{0}.cshtml",
            "/Views/Shared/{0}.cshtml"
        };
    }
}
