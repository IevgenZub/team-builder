using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.CognitiveServices.Language.TextAnalytics;
using Microsoft.EntityFrameworkCore;
using TeamBuilder.Web.Data;
using TeamBuilder.Web.Dto;
using TeamBuilder.Web.Models;
using TeamBuilder.Web.Services;

namespace TeamBuilder.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamEventsController : ControllerBase
    {   
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITextAnalyticsService _textAnalyticsService;

        public TeamEventsController(
            ApplicationDbContext context, 
            UserManager<ApplicationUser> userManager,
            ITextAnalyticsService textAnalyticsService)
        {
            _context = context;
            _userManager = userManager;
            _textAnalyticsService = textAnalyticsService;
        }

        // GET: api/TeamEvents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamEvent>>> GetTeamEvents()
        {
            IQueryable<TeamEvent> teamEvents = _context.TeamEvents;
            if (Request.Query.ContainsKey("my-events"))
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                var owner = await _userManager.FindByIdAsync(userId);

                teamEvents = teamEvents.Where(te => te.Owner == owner.Email);
            }

            return await _context.TeamEvents
                .OrderByDescending(te=> te.CreateDate)
                .ToListAsync();
        }

        // GET: api/TeamEvents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TeamEvent>> GetTeamEvent(int id)
        {
            var teamEvent = await _context.TeamEvents.FindAsync(id);

            if (teamEvent == null)
            {
                return NotFound();
            }

            return teamEvent;
        }

        // PUT: api/TeamEvents/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeamEvent(int id, TeamEventUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var teamEvent = await _context.TeamEvents.FirstOrDefaultAsync(te => te.Id == id);

            if (teamEvent == default)
            {
                return NotFound();
            }

            var startDate = Convert.ToDateTime(request.StartDate).Date
                .AddHours(request.StartTime.GetProperty("hour").GetUInt32())
                .AddMinutes(request.StartTime.GetProperty("minute").GetUInt32());

            teamEvent.Name = request.Name;
            teamEvent.Location = request.Location;
            teamEvent.StartDate = startDate;
            teamEvent.MinAttendees = request.MinAttendees;
            teamEvent.MaxAttendees = request.MaxAttendees;
            teamEvent.LocationImageUrl = request.LocationImageUrl;
            teamEvent.LogoImageUrl = request.LogoImageUrl;
            teamEvent.Attendees = request.Attendees;
            teamEvent.LastModifiedDate = DateTime.UtcNow;
            teamEvent.Photos = request.Photos;
            teamEvent.Reviews = request.Reviews;
            teamEvent.Categories= request.Categories;
            teamEvent.Comments= request.Comments;
            teamEvent.LocationMapUrl= request.LocationMapUrl;
            teamEvent.Description = request.Description;
            teamEvent.TicketPrice = request.TicketPrice;
            teamEvent.Status = request.Status;

            teamEvent.Description = await _textAnalyticsService.BuildTextWithLinksAsync(teamEvent.Description);
                        
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeamEventExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TeamEvents
        [HttpPost]
        public async Task<ActionResult> PostTeamEvent(TeamEventCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var utcNow = DateTime.UtcNow;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var owner = await _userManager.FindByIdAsync(userId);
            var startDate = Convert.ToDateTime(request.StartDate).Date
                    .AddHours(request.StartTime.GetProperty("hour").GetUInt32())
                    .AddMinutes(request.StartTime.GetProperty("minute").GetUInt32());

            var teamEvent = new TeamEvent
            {
                Name = request.Name,
                Location = request.Location,
                Description = request.Description,
                LocationMapUrl = request.LocationMapUrl,
                Categories = request.Categories,
                TicketPrice = request.TicketPrice,
                MaxAttendees = request.MaxAttendees,
                MinAttendees = request.MinAttendees,
                LogoImageUrl = request.LogoImageUrl,
                LocationImageUrl = request.LocationImageUrl,
                Status = request.Status,
                CreateDate = utcNow,
                LastModifiedDate = utcNow,
                StartDate = startDate,
                Owner = owner.Email,
                Attendees = "[]",
                Photos = "[]",
                Comments = "[]",
                Reviews = "[]"
            };

            _context.TeamEvents.Add(teamEvent);
            await _context.SaveChangesAsync();

            return Created($"api/teamevents/{teamEvent.Id}", teamEvent);
        }

        // DELETE: api/TeamEvents/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TeamEvent>> DeleteTeamEvent(int id)
        {
            var teamEvent = await _context.TeamEvents.FindAsync(id);
            if (teamEvent == null)
            {
                return NotFound();
            }

            _context.TeamEvents.Remove(teamEvent);
            await _context.SaveChangesAsync();

            return teamEvent;
        }

        private bool TeamEventExists(int id)
        {
            return _context.TeamEvents.Any(e => e.Id == id);
        }
    }
}
