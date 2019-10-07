using Microsoft.Azure.CognitiveServices.Language.TextAnalytics;
using Microsoft.Azure.CognitiveServices.Language.TextAnalytics.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
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
            var entitiesResponse = await _client.EntitiesAsync(input, "en");
            var keyPhrasesResponse = await _client.KeyPhrasesAsync(input, "en");
            var words = new SortedSet<string>();

            foreach (var entity in entitiesResponse.Entities)
            {
                words.Add(entity.Name);
            }

            foreach (var keyPhrase in keyPhrasesResponse.KeyPhrases)
            {
                words.Add(keyPhrase);
            }

            var photos = new HashSet<dynamic>();
            foreach (var word in words.OrderBy(w => w))
            {
                using (var httpClient = new HttpClient())
                {
                    var encodedEntity = HttpUtility.UrlEncode(word);
                    
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
                                input = ReplaceWithLink(input, " ", word, link);
                                input = ReplaceWithLink(input, ", ", word, link);
                                input = ReplaceWithLink(input, ". ", word, link);

                                teamEvent.Description = input;

                                var wikiImageResponse = await httpClient.GetStringAsync(
                                   $"{WikiSearchEndpoint}?action=query&"+ 
                                    "prop=pageimages&" +
                                    "formatversion=2&" + 
                                    "format=json&" + 
                                    "piprop=original&" + 
                                   $"titles={word}");

                                var imageUrl = ((JObject)JsonConvert.DeserializeObject(wikiImageResponse))
                                    .SelectToken("$.query.pages[0].original.source")?.Value<string>();

                                if (!string.IsNullOrEmpty(imageUrl))
                                {
                                    photos.Add(new { imageUrl = imageUrl, title = word, link = link });
                                }
                            }
                        }
                    }
                }
            }

            teamEvent.Photos = JsonConvert.SerializeObject(photos);
        }


        private static string ReplaceWithLink(string input, string delimiter, string word, string link)
        {
            input = input.Replace(" " + word + delimiter, $"<a target='_blank' href='{link}'> {word}{delimiter}</a>");
            return input;
        }
    }
}