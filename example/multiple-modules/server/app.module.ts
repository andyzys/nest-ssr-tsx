import { Module } from "@nestjs/common";
import { Feature1Module } from "./feature1/feature1.module";
import { Feature2Module } from "./feature2/feature2.module";
import { HomeModule } from "./home/home.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "buildfe"),
      serveRoot: "/build",
    }),
    Feature1Module,
    Feature2Module,
    HomeModule,
  ],
})
export class AppModule {}
