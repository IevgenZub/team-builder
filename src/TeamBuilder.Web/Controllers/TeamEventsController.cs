﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeamBuilder.Web.Data;
using TeamBuilder.Web.Dto;
using TeamBuilder.Web.Models;

namespace TeamBuilder.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamEventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public TeamEventsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/TeamEvents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamEvent>>> GetTeamEvents()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var owner = await _userManager.FindByIdAsync(userId);

            return await _context.TeamEvents.Where(te => te.Owner == owner.Email).ToListAsync();
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
        public async Task<IActionResult> PutTeamEvent(int id, TeamEvent teamEvent)
        {
            if (id != teamEvent.Id)
            {
                return BadRequest();
            }

            _context.Entry(teamEvent).State = EntityState.Modified;

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
            var utcNow = DateTime.UtcNow;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var owner = await _userManager.FindByIdAsync(userId);
            var startDate = Convert.ToDateTime(request.StartDate)
                    .AddHours(request.StartTime.GetProperty("hour").GetUInt32())
                    .AddMinutes(request.StartTime.GetProperty("minute").GetUInt32());

            var teamEvent = new TeamEvent
            {
                Name = request.Name,
                Location = request.Location,
                MaxAttendees = request.MaxAttendees,
                MinAttendees = request.MinAttendees,
                LogoImageUrl = request.LogoImageUrl,
                LocationImageUrl = request.LocationImageUrl,
                CreateDate = utcNow,
                LastModifiedDate = utcNow,
                StartDate = startDate,
                Owner = owner.Email,
                Status = "Created"
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
