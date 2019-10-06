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
        private const string Key = "ced608eaa18b4bd195cd895dce0ec44c";
        private const string Endpoint = "https://team-builder-text-analytics.cognitiveservices.azure.com/";
        private readonly TextAnalyticsClient _client = new TextAnalyticsClient(new ApiKeyServiceClientCredentials(Key)) { Endpoint = Endpoint };

        public async Task<string> BuildTextWithLinksAsync(string input)
        {
            var result = await _client.EntitiesAsync(input, "en");
            foreach (var entity in result.Entities)
            {
                var httpClient = new HttpClient();
                var googleResponseRaw = await httpClient.GetStringAsync("https://www.googleapis.com/customsearch/v1?q=" 
                    + HttpUtility.UrlEncode(entity.Name)
                    + "&key=AIzaSyAYzZU-9D3UyaCcZO2Wos6NKsG6aTXMGLM&cx=013528689194530833786:sbwqcuqvzet");
                
                var data = (JObject)JsonConvert.DeserializeObject(googleResponseRaw);
                var link = data.SelectToken("items[0].link").Value<string>();
                input = input.Replace(entity.Name, $"<a target='_blank' href='{link}'>{entity.Name}</a>");
            }

            return input;
        }
    }
}