import {provide, Component, ComponentResolver} from '@angular/core';
import {
  Router,
  RouterOutletMap,
  RouteSegment,
  Route,
  ROUTER_DIRECTIVES,
  Routes,
  RouterUrlSerializer,
  DefaultRouterUrlSerializer,
  OnActivate,
  CanDeactivate
} from '@angular/router';
import {Location} from '@angular/common';
import {tick} from '@angular/core/testing';
import {SpyLocation} from '@angular/common/testing';
import {
  TestComponentBuilder,
  ComponentFixture
} from '@angular/compiler/testing';

@Component({
  selector: 'root-comp',
  template: `<router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES]
})
@Routes([
  new Route({ path: '/', component: HelloCmp }),
  new Route({ path: '/abc', component: HelloCmp }),
  new Route({ path: '/def', component: HelloCmp }),
  new Route({ path: '/ghi', component: HelloCmp }),
  new Route({ path: '/sections/123/pages/456', component: HelloCmp })
 ])
export class RootCmp {
  name: string;
}

@Component({ selector: 'hello-cmp', template: `{{greeting}}` })
export class HelloCmp {
  greeting: string;
  constructor() { this.greeting = 'hello'; }
}

export function compile(tcb: TestComponentBuilder): Promise<ComponentFixture<any>> {
  return tcb.createAsync(RootCmp);
}

export const TEST_ROUTER_PROVIDERS: any[] = [
  provide(RouterUrlSerializer, {useClass: DefaultRouterUrlSerializer}),
  RouterOutletMap,
  provide(Location, {useClass: SpyLocation}),
  provide(Router, {
    useFactory: (resolver: ComponentResolver, urlParser: RouterUrlSerializer, outletMap: RouterOutletMap, location: Location) => 
      new Router("RootComponent", RootCmp, resolver, urlParser, outletMap, location),
    deps: [ComponentResolver, RouterUrlSerializer, RouterOutletMap, Location]
  })
];

export function advance(fixture: ComponentFixture<any>): void {
  tick();
  fixture.detectChanges();
}
