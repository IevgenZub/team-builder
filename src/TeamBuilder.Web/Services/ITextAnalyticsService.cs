using System.Threading.Tasks;

namespace TeamBuilder.Web
{
    public interface ITextAnalyticsService
    {
        Task<string> BuildTextWithLinksAsync(string input);
    }
}