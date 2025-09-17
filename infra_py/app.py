#!/usr/bin/env python3
import aws_cdk as cdk
from stacks.website_stack import WebsiteStack


app = cdk.App()

WebsiteStack(app, "WorkshopWebsiteStackPy", env=cdk.Environment(region="ap-east-1"))

cdk.Tags.of(app).add("Project", "AWSCommunityDayWorkshop")

app.synth()


