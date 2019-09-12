using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TeamBuilder.Web.Data.Migrations
{
    public partial class ExtendTeamEvent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreateDate",
                table: "TeamEvents",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LastModifiedDate",
                table: "TeamEvents",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<string>(
                name: "LocationImageUrl",
                table: "TeamEvents",
                nullable: true,
                maxLength: 1000);

            migrationBuilder.AddColumn<string>(
                name: "LogoImageUrl",
                table: "TeamEvents",
                nullable: true,
                maxLength: 1000);

            migrationBuilder.AddColumn<int>(
                name: "MaxAttendees",
                table: "TeamEvents",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinAttendees",
                table: "TeamEvents",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Owner",
                table: "TeamEvents",
                nullable: true,
                maxLength: 100);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "StartDate",
                table: "TeamEvents",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "TeamEvents",
                nullable: true,
                maxLength: 100);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreateDate",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "LastModifiedDate",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "LocationImageUrl",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "LogoImageUrl",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "MaxAttendees",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "MinAttendees",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "Owner",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "TeamEvents");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "TeamEvents");
        }
    }
}
