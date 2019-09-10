using System.ComponentModel.DataAnnotations;

namespace TeamBuilder.Web.Models
{
    public class TeamEvent
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
    }
}