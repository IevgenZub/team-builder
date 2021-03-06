﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.Web.Dto
{
    public class TeamEventCreateRequest
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public string LocationMapUrl { get; set; }
        public decimal TicketPrice { get; set; }
        public string Description { get; set; }
        public string StartDate { get; set; }
        public dynamic StartTime { get; set; }
        public string Owner { get; set; }
        public int? MinAttendees { get; set; }
        public int? MaxAttendees { get; set; }
        public string Status { get; set; }
        public string LogoImageUrl { get; set; }
        public string LocationImageUrl { get; set; }
        public string Categories { get; set; }
    }
}
