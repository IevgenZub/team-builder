using Microsoft.Azure.CognitiveServices.Language.TextAnalytics;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace TeamBuilder.Web.Services
{
    public class TextAnalyticsService : ITextAnalyticsService
    {
        private const string AzureTextAnalyticsKey = "ced608eaa18b4bd195cd895dce0ec44c";
        private const string AzureTextAnalyticsEndpoint = "https://team-builder-text-analytics.cognitiveservices.azure.com/";
        
        private readonly TextAnalyticsClient _client = new TextAnalyticsClient(
            new ApiKeyServiceClientCredentials(AzureTextAnalyticsKey)) { Endpoint = AzureTextAnalyticsEndpoint };

        public async Task<string> BuildTextWithLinksAsync(string input)
        {
            var result = await _client.EntitiesAsync(input, "en");
            foreach (var entity in result.Entities)
            {
                var httpClient = new HttpClient();
                var wikiResponseRaw = await httpClient.GetStringAsync("https://en.wikipedia.org/w/api.php?action=opensearch&"
                    + $"search={HttpUtility.UrlEncode(entity.Name)}&limit=1&namespace=0&format=json");
                
                var wikiResponse = (JArray)JsonConvert.DeserializeObject(wikiResponseRaw);
                if (wikiResponse.Count == 4)
                {
                    var links = (JArray)wikiResponse[3];
                    if (links.Count == 1)
                    {
                        var link = ((JArray)wikiResponse[3])[0].Value<string>();
                        input = input.Replace(entity.Name, $"<a target='_blank' href='{link}'>{entity.Name}</a>");
                    }
                }
            }

            return input;
        }
    }
}