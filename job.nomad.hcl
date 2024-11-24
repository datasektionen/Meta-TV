job "meta-tv" {
  type = "service"

  group "meta-tv" {
    network {
      port "http" { }
      port "mongodb" {
        static = 27017
      }
    }

    service {
      name     = "meta-tv"
      port     = "http"
      provider = "nomad"
      tags = [
        "traefik.enable=true",
        "traefik.http.routers.meta-tv.rule=Host(`meta-tv.datasektionen.se`)",
        "traefik.http.routers.meta-tv.tls.certresolver=default",
      ]
    }

    task "meta-tv" {
      driver = "docker"

      config {
        image = var.image_tag
        ports = ["http"]
      }

      template {
        data        = <<ENV
{{ with nomadVar "nomad/jobs/meta-tv" }}
LOGIN_KEY={{ .login_api_key }}
MONGO_URL=mongodb://tv:{{ .database_password }}@{{ env "NOMAD_ADDR_mongodb" }}/
BANLIST={{ .banlist }}
{{ end }}
PORT={{ env "NOMAD_PORT_http" }}
ROOT_URL=https://tv.datasektionen.se
ENV
        destination = "local/.env"
        env         = true
      }

      resources {
        memory = 200
      }
    }

    task "mongodb" {
      driver = "docker"

      config {
        image = "docker.io/mongo:3.2.9"
      }

      template {
        data        = <<ENV
{{ with nomadVar "nomad/jobs/meta-tv" }}
MONGO_INITDB_ROOT_USERNAME=tv
MONGO_INITDB_ROOT_PASSWORD={{ .database_password }}
{{ end }}
ENV
        destination = "local/.env"
        env         = true
      }

    }
  }
}

variable "image_tag" {
  type = string
  default = "ghcr.io/datasektionen/meta-tv:latest"
}
