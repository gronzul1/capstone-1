import { S3Client, CreateBucketCommand, PutBucketPolicyCommand, ListBucketsCommand, DeleteBucketCommand, DeletePublicAccessBlockCommand, PutBucketWebsiteCommand } from "@aws-sdk/client-s3"; // ES Modules import
import { IAMClient, CreateRoleCommand } from "@aws-sdk/client-iam"; // ES Modules import

const REGION = "us-east-1";
const ACCKEYID = "";
const SECRET = "";
const BUCKETNAME = 'gr-cap-1'
const FOLDER = "Repo";
const config = {
    region: REGION,
    credentials: {
        accessKeyId: ACCKEYID,
        secretAccessKey: SECRET
    }
}
//#region fx S3
const s3 = new S3Client(config);

export const listS3 = async () => {
    console.log("listS3...")
    const input = {};
    const command = new ListBucketsCommand(input);
    return await s3.send(command) || "";
}

export const deleteS3 = async () => {
    console.log("deleteS3...")
    const input = {
        "Bucket": BUCKETNAME
    };
    const command = new DeleteBucketCommand(input);
    return await s3.send(command);

}

export const createS3 = async () => {
    console.log("createS3...")
    const input = {
        "Bucket": BUCKETNAME
    };
    const command = new CreateBucketCommand(input);
    return await s3.send(command);
}

export const allowPublic = async () => {
    console.log("allowPublic...")
    const input = { // DeletePublicAccessBlockRequest
        Bucket: BUCKETNAME
    };
    const command = new DeletePublicAccessBlockCommand(input);
    return await s3.send(command);
}

export const enableWebSite = async () => {
    console.log("enableWebSite...")
    const input = {
        "Bucket": BUCKETNAME,
        'WebsiteConfiguration':
        { // WebsiteConfiguration
            IndexDocument: { // IndexDocument
                "Suffix": "index.html"
            },
        }
    };
    const command = new PutBucketWebsiteCommand(input);
    return await s3.send(command);
}

export const assignS3Policy = async () => {
    console.log("assignS3Policy...")
    const input = {
        "Bucket": BUCKETNAME,
        "Policy": JSON.stringify(
            {
                "Id": "Policy1693310659772",
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "Stmt1693310658340",
                        "Action": [
                            "s3:GetObject",
                            // "s3:PutObject"
                        ],
                        "Effect": "Allow",
                        "Resource": "arn:aws:s3:::" + BUCKETNAME + "/*",
                        "Principal": "*"
                    }
                ]
            }
        )
    };
    const command = new PutBucketPolicyCommand(input);
    return await s3.send(command);
}

function creaS3() {
    createS3().then(data => {
        console.log(data.Location);
        allowPublic().then(data => {
            enableWebSite().then(data => {
                assignS3Policy().then(data => {
                })
            })
        })
    })
}
//#endregion

function start() {
    listS3().then(data => {
        console.log(data);
        let l = data.Buckets?.length || 0;
        if (l > 0) {
            data.Buckets?.forEach((b: any) => {
                if (b.Name == BUCKETNAME) {
                    //delete exist bucket                    
                    deleteS3().then((data: any) => {
                        // console.log(data);
                        creaS3();
                    });
                }
            });
        }
        else {
            creaS3();
        }
    })
}

/******************************** */
start();
/******************************** */