using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;
using TeamBuilder.Web.Data;

namespace TeamBuilder.Web.Hubs
{
    public class TeamEventsHub: Hub
    {
        private readonly ApplicationDbContext _context;

        public TeamEventsHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task NewComment(int teamEventId, string username, string message)
        {
            var teamEvent = await _context.TeamEvents.FirstOrDefaultAsync(te => te.Id == teamEventId);
            var comments = JsonConvert.DeserializeObject<JArray>(teamEvent.Comments);

            comments.Add(new JObject
            {
                { "user", username },
                { "text", message },
                { "date", DateTime.Now }
            });

            teamEvent.Comments = JsonConvert.SerializeObject(comments);
            await _context.SaveChangesAsync();

            await Clients.All.SendAsync("commentReceived", username, message);
        }
    }
}
