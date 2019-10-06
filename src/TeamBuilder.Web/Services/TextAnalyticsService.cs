using Microsoft.Azure.CognitiveServices.Language.TextAnalytics;
using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;

namespace TeamBuilder.Web.Services
{
    public class TextAnalyticsService : ITextAnalyticsService
    {
        private const string Key = "ced608eaa18b4bd195cd895dce0ec44c";
        private const string Endpoint = "https://team-builder-text-analytics.cognitiveservices.azure.com/";
        private readonly TextAnalyticsClient _client = new TextAnalyticsClient(new ApiKeyServiceClientCredentials(Key)) { Endpoint = Endpoint };

        public async Task<string> BuildTextWithLinksAsync(string input)
        {
            var result = await _client.KeyPhrasesAsync(input, "en");
            foreach (var keyPhrase in result.KeyPhrases)
            {
                // TODO Add call to google search api https://developers.google.com/api-client-library/dotnet/get_started?hl=uk
            }

            return "text with links";
        }
    }
}