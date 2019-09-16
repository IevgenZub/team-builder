using Microsoft.EntityFrameworkCore.Migrations;

namespace TeamBuilder.Web.Data.Migrations
{
    public partial class ExtendTeamEventsWithCollections : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Categories",
                table: "TeamEvents",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Comments",
                table: "TeamEvents",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "TeamEvents",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LocationMapUrl",
                table: "TeamEvents",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Photos",
                table: "TeamEvents",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Reviews",
                table: "TeamEvents",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TicketPrice",
                table: "TeamEvents",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Categories",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "Comments",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "LocationMapUrl",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "Photos",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "Reviews",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "TicketPrice",
                table: "TeamEvents");
        }
    }
}
