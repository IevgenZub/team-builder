using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeamBuilder.Web.Data;
using TeamBuilder.Web.Models;

namespace TeamBuilder.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamEventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeamEventsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/TeamEvents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamEvent>>> GetTeamEvents()
        {
            return await _context.TeamEvents.ToListAsync();
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
        public async Task<ActionResult<TeamEvent>> PostTeamEvent(TeamEvent teamEvent)
        {
            _context.TeamEvents.Add(teamEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTeamEvent", new { id = teamEvent.Id }, teamEvent);
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
