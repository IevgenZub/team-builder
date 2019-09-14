using Microsoft.EntityFrameworkCore.Migrations;

namespace TeamBuilder.Web.Data.Migrations
{
    public partial class AddAttendees : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Attendees",
                table: "TeamEvents",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Attendees",
                table: "TeamEvents");
        }
    }
}
