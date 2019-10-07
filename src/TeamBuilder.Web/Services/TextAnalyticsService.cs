using Microsoft.Azure.CognitiveServices.Language.TextAnalytics;
using Microsoft.Azure.CognitiveServices.Language.TextAnalytics.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace TeamBuilder.Web.Services
{
    public class TextAnalyticsService : ITextAnalyticsService
    {
        private const string AzureTextAnalyticsKey = "ced608eaa18b4bd195cd895dce0ec44c";
        private const string AzureTextAnalyticsEndpoint = "https://team-builder-text-analytics.cognitiveservices.azure.com/";
        private const string WikiSearchEndpoint = "https://en.wikipedia.org/w/api.php";
        
        private readonly TextAnalyticsClient _client = new TextAnalyticsClient(
            new ApiKeyServiceClientCredentials(AzureTextAnalyticsKey)) { Endpoint = AzureTextAnalyticsEndpoint };

        public async Task<string> BuildTextWithLinksAsync(string input)
        {
            var result = await _client.EntitiesAsync(input, "en");
            string wikiResponseRaw = null;
            foreach (var entity in result.Entities)
            {
                using (var httpClient = new HttpClient())
                {
                    var encodedEntity = HttpUtility.UrlEncode(entity.Name);

                    wikiResponseRaw = await httpClient.GetStringAsync(
                        $"{WikiSearchEndpoint}?action=opensearch&search={encodedEntity}&limit=1&namespace=0&format=json");
                }

                if (!string.IsNullOrEmpty(wikiResponseRaw))
                {
                    var wikiResponse = (JArray)JsonConvert.DeserializeObject(wikiResponseRaw);
                    if (wikiResponse.Count == 4)
                    {
                        var links = (JArray)wikiResponse[3];
                        if (links.Count == 1)
                        {
                            var link = ((JArray)wikiResponse[3])[0].Value<string>();
                            input = ReplaceWithLink(input, " ", entity, link); 
                            input = ReplaceWithLink(input, ", ", entity, link); 
                            input = ReplaceWithLink(input, ". ", entity, link);
                        }
                    }
                }
            }

            return input;
        }

        private static string ReplaceWithLink(string input, string delimiter, EntityRecord entity, string link)
        {
            input = input.Replace(" " + entity.Name + delimiter, $"<a target='_blank' href='{link}'> {entity.Name}{delimiter}</a>");
            return input;
        }
    }
}