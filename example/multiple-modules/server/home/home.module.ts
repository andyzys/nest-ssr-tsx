import { Module } from "@nestjs/common";
import { resolve } from "path";
import { TsxViewsModule } from "../../../../src/nestjs-render/tsx-views.module";
import { HomeController } from "./home.controller";

@Module({
  imports: [
    TsxViewsModule.register({
      forRoutes: [HomeController],
    }),
  ],
  controllers: [HomeController],
})
export class HomeModule {}
