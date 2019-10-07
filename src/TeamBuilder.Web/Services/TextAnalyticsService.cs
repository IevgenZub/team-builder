using Microsoft.Azure.CognitiveServices.Language.TextAnalytics;
using Microsoft.Azure.CognitiveServices.Language.TextAnalytics.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using TeamBuilder.Web.Models;

namespace TeamBuilder.Web.Services
{
    public class TextAnalyticsService : ITextAnalyticsService
    {
        private const string AzureTextAnalyticsKey = "ced608eaa18b4bd195cd895dce0ec44c";
        private const string AzureTextAnalyticsEndpoint = "https://team-builder-text-analytics.cognitiveservices.azure.com/";
        private const string WikiSearchEndpoint = "https://en.wikipedia.org/w/api.php";
        
        private readonly TextAnalyticsClient _client = new TextAnalyticsClient(
            new ApiKeyServiceClientCredentials(AzureTextAnalyticsKey)) { Endpoint = AzureTextAnalyticsEndpoint };

        public async Task BuildTextWithLinksAsync(TeamEvent teamEvent)
        {
            var input = teamEvent.Description;
            var result = await _client.EntitiesAsync(input, "en");
            var photos = new List<string>();
            foreach (var entity in result.Entities)
            {
                using (var httpClient = new HttpClient())
                {
                    var encodedEntity = HttpUtility.UrlEncode(entity.Name);
                    
                    var wikiResponseRaw = await httpClient.GetStringAsync(
                       $"{WikiSearchEndpoint}?action=opensearch&" + 
                       $"search={encodedEntity}&" + 
                        "limit=1&" + 
                        "namespace=0&" + 
                        "format=json");

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

                                teamEvent.Description = input;

                                var wikiImageResponse = await httpClient.GetStringAsync(
                                   $"{WikiSearchEndpoint}?action=query&"+ 
                                    "prop=pageimages&" +
                                    "formatversion=2&" + 
                                    "format=json&" + 
                                    "piprop=original&" + 
                                   $"titles={entity.Name}");

                                var imageUrl = ((JObject)JsonConvert.DeserializeObject(wikiImageResponse))
                                    .SelectToken("$.query.pages[0].original.source")?.Value<string>();

                                if (!string.IsNullOrEmpty(imageUrl))
                                {
                                    photos.Add(imageUrl);
                                }
                            }
                        }
                    }
                }
            }

            teamEvent.Photos = JsonConvert.SerializeObject(photos);
        }

        private static string ReplaceWithLink(string input, string delimiter, EntityRecord entity, string link)
        {
            input = input.Replace(" " + entity.Name + delimiter, $"<a target='_blank' href='{link}'> {entity.Name}{delimiter}</a>");
            return input;
        }
    }
}