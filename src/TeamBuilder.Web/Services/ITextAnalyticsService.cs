using System.Threading.Tasks;
using TeamBuilder.Web.Models;

namespace TeamBuilder.Web
{
    public interface ITextAnalyticsService
    {
        Task BuildTextWithLinksAsync(TeamEvent teamEvent);
    }
}